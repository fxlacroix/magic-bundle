<?php

namespace FXL\Bundle\MagicBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/admin")
 *
 */
class AdminController extends Controller
{

    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/{formName}")
     * @Template()
     */
    public function adminAction($formName)
    {
        $entity = new \FXL\Bundle\TestBundle\Entity\Product();
        $entity->setName("hello");
        $entity->setId(1);

        $form = $this->createForm('fxl_bundle_testbundle_product', $entity)->createView();

        return array(
            'form' => $form,
            'entities' => array($entity)
        );
    }

}
